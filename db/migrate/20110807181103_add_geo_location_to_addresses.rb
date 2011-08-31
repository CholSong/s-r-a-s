class AddGeoLocationToAddresses < ActiveRecord::Migration
  def self.up
    add_column :addresses, :latitude, :decimal
    add_column :addresses, :longitude, :decimal
  end

  def self.down
    remove_column :addresses, :latitude
    remove_column :addresses, :longitude
  end
end