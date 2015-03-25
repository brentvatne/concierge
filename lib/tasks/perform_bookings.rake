task :perform_bookings => [:environment] do
  PerformBookings.execute(
    Booking.within_booking_window.incomplete
  )
end
