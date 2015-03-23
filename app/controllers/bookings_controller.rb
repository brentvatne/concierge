class BookingsController < ApplicationController

  def upcoming
    @bookings = current_user.bookings.upcoming
    @bookings.to_a.map! { |b| BookingSerializer.new(b, root: false) }
    render json: @bookings
  end

  def complete
    @bookings = current_user.bookings.complete
    @bookings.to_a.map! { |b| BookingSerializer.new(b, root: false) }
    render json: @bookings
  end

end
