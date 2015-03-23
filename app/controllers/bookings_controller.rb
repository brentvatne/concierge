class BookingsController < ApplicationController

  def new
  end

  def create
    time = Chronic.parse("#{booking_params[:date]} at #{booking_params[:time]}")

    @booking = current_user.bookings.create(
      title: booking_params[:title],
      address: booking_params[:address],
      time: time
    )

    if @booking.persisted?
      render json: {success: true, id: @booking.id}
    else
      render json: {success: false}
    end
  end

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

  private

  def booking_params
    params.require(:booking).permit(:title, :date, :time, :address)
  end

end
