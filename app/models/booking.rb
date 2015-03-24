class Booking < ActiveRecord::Base
  belongs_to :user
  validates :address, :lat, :lon, :time, :title, presence: true

  def self.upcoming
    where('time > ?', Time.now)
  end

  def self.incomplete
    where('complete = ?', false)
  end

  def self.upcoming_or_active
    where('time > ? or (complete = ? and car_booked_time <= ? and time > ?)',
          Time.now, true, Time.now - 30.minutes, Time.now - 30.minutes)
  end

  def self.within_booking_window
    where('time >= ? and time <= ?', Time.now, Time.now + 25.minutes)
  end

  def self.complete
    where('time < ? and complete = ?', Time.now, true)
  end

  def self.past
    where('time < ?', Time.now)
  end

  def self.past_and_incomplete
    where('time < ? and complete = ?', Time.now, false)
  end

  def perform!(vin)
    if car = user.create_booking(vin)
      update_attributes(complete: true,
                        car_address: car[:address],
                        car_booked_time: car[:time],
                        car_license_plate: car[:license_plate])
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
