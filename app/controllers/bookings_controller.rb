class BookingsController < ApplicationController

  def new
  end

  def now
    @booking = current_user.bookings.create(
      title: 'Get me a car now!',
      location: {lat: params[:lat], lon: params[:lon]},
      time: Time.now,
      asap: true
    )

    PerformBookings.execute(@booking)

    render json: {success: true}
  end

  def edit
    @booking = Booking.find(params[:id])
  end

  def cancel
    @booking = Booking.find(params[:id])
    if @booking.cancel!
      @booking.destroy
      render json: {success: true}
    else
      render json: {success: false}
    end
  end

  def destroy
    @booking = Booking.find(params[:id])
    render json: {success: !!@booking.destroy}
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

  def update
    time = Chronic.parse("#{booking_params[:date]} at #{booking_params[:time]}")
    @booking = Booking.find(params[:id])
    @booking.update_attributes(
      title: booking_params[:title],
      address: booking_params[:address],
      time: time
    )

    if @booking.valid?
      render json: {success: true}
    else
      render json: {success: false}
    end
  end

  def upcoming
    @bookings = current_user.bookings.upcoming_or_active.order('time ASC')
    @bookings.to_a.map! { |b| BookingSerializer.new(b, root: false) }
    render json: @bookings
  end

  def past
    @bookings = current_user.bookings.past.order('time DESC')
    @bookings = @bookings.to_a - current_user.bookings.upcoming_or_active.order('time ASC').to_a
    @bookings.map! { |b| BookingSerializer.new(b, root: false) }
    render json: @bookings
  end

  private

  def booking_params
    params.require(:booking).permit(:title, :date, :time, :address)
  end

end
