class Booking < ActiveRecord::Base
  belongs_to :user

  def self.upcoming
    where('time > ?', Time.now)
  end

  def self.complete
    where('time < ? and complete = ?', Time.now, true)
  end

  def self.past_and_incomplete
    where('time < ? and complete = ?', Time.now, false)
  end

  def address=(new_address)
    if new_address != address
      write_attribute(:address, new_address)
      update_lat_lon_from_address
    end
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
