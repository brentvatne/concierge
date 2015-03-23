MAXIMUM_DISTANCE = 750

task :perform_bookings => [:environment] do
  if bookings = Booking.upcoming
    cars = ApiClient.available_cars.map { |car|
      lng = car['coordinates'].first
      lat = car['coordinates'].second
      car['location'] = Geokit::GeoLoc.new(lat: lat, lng: lng)
      car
    }

    bookings.each do |booking|
      cars = cars.
        map      { |car| car['distance'] = booking.distance_to(car['location']); car }.
        find_all { |car| car['distance'] < MAXIMUM_DISTANCE }.
        sort_by  { |car| car['distance'] }

      cars.each do |car|
        break if booking.perform!(car['vin'])
      end

      if booking.complete?
        # send text notification
      else
        # how much time is left? possibly send a warning if only 10 mins left
        # and still nothing
        #
        # if time has run out, send a warning saying couldn't be found, link
        # to bus routes and give taxi number?
      end
    end
  end
end
