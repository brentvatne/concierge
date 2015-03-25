class AddInProgressToBookings < ActiveRecord::Migration
  def change
    add_column :bookings, :in_progress, :boolean, default: false, null: false
  end
end
