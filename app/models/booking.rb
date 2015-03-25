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
    where('time > ? or
          (complete = ? and car_booked_time > ?) or
          (asap = ? and complete = ?)',
          Time.now,
          true, Time.now - 30.minutes,
          true, false)
  end

  def self.within_booking_window
    where('(time >= ? and time <= ?) or (asap = ?)',
          Time.now, Time.now + 25.minutes, true)
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

  def cancel!
    return false if complete? == false || reservation_id.blank?

    if user.cancel_booking(reservation_id)
      clear_booking_attributes!
      true
    end
  end

  def clear_booking_attributes!
    update_attributes(complete: false,
                      in_progress: false,
                      car_address: nil,
                      car_booked_time: nil,
                      car_license_plate: nil,
                      reservation_id: nil,
                      reservation_response: nil)
  end

  def perform!(vin)
    if car = user.create_booking(vin)
      update_attributes(complete: true,
                        in_progress: false,
                        car_address: car[:address],
                        car_booked_time: car[:time],
                        car_license_plate: car[:license_plate],
                        reservation_id: car[:reservation_id],
                        reservation_response: car[:full_response])
    end
  end

  def address=(new_address)
    if new_address != address
      write_attribute(:address, new_address)
      update_lat_lon_from_address
    end
  end

  def location=(coords)
    write_attribute(:lat, coords[:lat])
    write_attribute(:lon, coords[:lon])
    write_attribute(:address, 'your current location')
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
