class AddReservationIdToBookings < ActiveRecord::Migration
  def change
    add_column :bookings, :reservation_id, :string
  end
end
