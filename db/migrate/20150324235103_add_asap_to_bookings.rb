class AddAsapToBookings < ActiveRecord::Migration
  def change
    add_column :bookings, :asap, :boolean, default: false, null: false
  end
end
