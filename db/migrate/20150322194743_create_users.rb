class CreateUsers < ActiveRecord::Migration
  def change
    create_table :users do |t|
      t.string :oauth_token_secret
      t.string :oauth_token
      t.string :email
      t.string :phone
      t.string :name
      t.timestamps
    end
  end
end
