class AddReservationResponseToBookings < ActiveRecord::Migration
  def change
    add_column :bookings, :reservation_response, :text
  end
end
