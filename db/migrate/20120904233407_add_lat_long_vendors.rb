class AddLatLongVendors < ActiveRecord::Migration
  def self.up
    add_column :vendors, :latitude, :integer
    add_column :vendors, :longitude, :integer
  end

  def self.down
    remove_column :vendors, :latitude
    remove_column :vendors, :longitude
  end
end
