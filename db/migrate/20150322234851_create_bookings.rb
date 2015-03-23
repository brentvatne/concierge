class CreateBookings < ActiveRecord::Migration
  def change
    create_table :bookings do |t|
      t.string :title
      t.datetime :time
      t.string :address
      t.float :lat
      t.float :lon
      t.boolean :complete, default: false, null: false
      t.references :user
      t.timestamps
    end
  end
end
