class ChangeLatLongVendorsFloat < ActiveRecord::Migration
  def self.up
  	change_column :vendors, :latitude, :float
  	change_column :vendors, :longitude, :float
  end

  def self.down
  	change_column :vendors, :latitude, :integer
  	change_column :vendors, :longitude, :integer
  end
end
