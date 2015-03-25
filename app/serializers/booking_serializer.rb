class BookingSerializer < ActiveModel::Serializer
  attributes :id, :title, :time, :day, :date, :address, :lat, :lon, :complete,
    :car_address, :car_license_plate, :in_progress

  def time
    object.time.strftime('%l:%M %p')
  end

  def day
    object.time.strftime('%A')
  end

  def date
    object.time.strftime('%B %d, %Y')
  end
end
