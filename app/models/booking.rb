class Booking < ActiveRecord::Base
  belongs_to :user
  validates :address, :lat, :lon, :time, :title, presence: true

  def self.upcoming
    where('time > ?', Time.now)
  end

  def self.incomplete
    where('complete = ?', false)
  end

  def self.within_thirty_minutes
    where('time >= ? and time <= ?', Time.now, Time.now + 30.minutes)
  end

  def self.complete
    where('time < ? and complete = ?', Time.now, true)
  end

  def self.past_and_incomplete
    where('time < ? and complete = ?', Time.now, false)
  end

  def perform!(vin)
    car = if user.create_booking(vin)
      update_attributes(complete: true,
                        car_address: car[:address],
                        car_booked_time: car[:time])
    end
  end

  def address=(new_address)
    if new_address != address
      write_attribute(:address, new_address)
      update_lat_lon_from_address
    end
  end

  def distance_to(other_location)
    location.distance_to(other_location)
  end

  def location
    Geokit::GeoLoc.new(lat: lat, lng: lon)
  end

  def update_lat_lon_from_address
    result = Geokit::Geocoders::GoogleGeocoder.geocode(address)
    if result.success?
      self.lat = result.lat
      self.lon = result.lng
    else
      self.lat = 0
      self.lon = 0
    end
  end

end
