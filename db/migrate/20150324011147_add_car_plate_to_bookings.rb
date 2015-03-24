class AddCarPlateToBookings < ActiveRecord::Migration
  def change
    add_column :bookings, :car_license_plate, :string
  end
end
