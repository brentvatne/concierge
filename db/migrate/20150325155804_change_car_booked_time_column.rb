class ChangeCarBookedTimeColumn < ActiveRecord::Migration
  def change
    remove_column :bookings, :car_booked_time
    add_column :bookings, :car_booked_time, :datetime
  end
end
