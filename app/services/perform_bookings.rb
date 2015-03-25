class PerformBookings

  def self.execute(bookings)
    new(bookings).execute
  end

  def initialize(bookings)
    @bookings = Array.wrap(bookings)
  end

  def execute
    @bookings.each do |booking|
      booking.update_attributes(in_progress: true) unless booking.in_progress?

      available_cars_for(booking).each do |car|
        begin
          puts "attempting to book #{car['vin']}"
          break if booking.perform!(car['vin'])
        rescue Exception => e
          Rails.logger.info(e.backtrace)
        end

        if booking.complete?
          after_complete(booking)
        else
          puts "Nothing close enough to #{booking.id}"
        end
      end
    end
  end

  private

  def after_complete(booking)
    begin
      twilio.messages.create(
        from: '+16042278434',
        to: booking.user.phone,
        body: "car2go booking: #{booking.car_address} ready"
      )
    rescue Exception => e
      puts "Error while sending text message:"
      Rails.logger.info(e.backtrace)
    end
  end

  def available_cars_for(booking)
    available_cars.
      map      { |car| car['distance'] = booking.distance_to(car['location']); car }.
      find_all { |car| car['distance'] < 750 }.
      sort_by  { |car| car['distance'] }
  end

  def available_cars
    @available_cars ||= ApiClient.available_cars.map { |car|
      lng = car['coordinates'].first
      lat = car['coordinates'].second
      car['location'] = Geokit::GeoLoc.new(lat: lat, lng: lng)
      car
    }
  end

  def twilio
    @twilio ||= Twilio::REST::Client.new
  end
end
