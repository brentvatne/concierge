task :perform_bookings => [:environment] do
  twilio = Twilio::REST::Client.new

  if bookings = Booking.within_thirty_minutes.incomplete
    cars = ApiClient.available_cars.map { |car|
      lng = car['coordinates'].first
      lat = car['coordinates'].second
      car['location'] = Geokit::GeoLoc.new(lat: lat, lng: lng)
      car
    }

    bookings.each do |booking|
      cars = cars.
        map      { |car| car['distance'] = booking.distance_to(car['location']); car }.
        find_all { |car| car['distance'] < 750 }.
        sort_by  { |car| car['distance'] }

      puts cars

      cars.each do |car|
        begin
          puts "attempting to book #{car['vin']}"
          break if booking.perform!(car['vin'])
        rescue Exception => e
          Rails.logger.info(e.inspect)
        end
      end

      if booking.complete?
        puts "sending text.."
        twilio.messages.create(
          from: '+16042278434',
          to: booking.user.phone,
          body: "car2go booking: #{booking.car_address} ready"
        )
      else
        puts "nothing close enough.."
        # how much time is left? possibly send a warning if only 10 mins left
        # and still nothing
        #
        # if time has run out, send a warning saying couldn't be found, link
        # to bus routes and give taxi number?
      end
    end
  end
end
