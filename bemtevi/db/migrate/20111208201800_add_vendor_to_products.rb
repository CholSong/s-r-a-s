class AddVendorToProducts < ActiveRecord::Migration
  
  def self.up
    add_column :products, :vendor_id, :integer
  end

  def self.down
    remove_column :products, :vendor_id
  end
  
end
