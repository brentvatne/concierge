class AddCompletedFieldsToBooking < ActiveRecord::Migration
  def change
    add_column :bookings, :car_address, :string
    add_column :bookings, :car_distance, :string
    add_column :bookings, :car_booked_time, :string
  end
end
