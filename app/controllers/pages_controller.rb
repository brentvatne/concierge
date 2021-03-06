class PagesController < ApplicationController

  def home
    if current_user.present?
      @upcoming_bookings = current_user.bookings.upcoming_or_active.order('time ASC')
      @upcoming_bookings.to_a.map! { |b| BookingSerializer.new(b, root: false) }
    end
  end

end
