class AddVendorToPromotions < ActiveRecord::Migration
  
  def self.up
    add_column :promotions, :vendor_id, :integer
  end

  def self.down
    remove_column :promotions, :vendor_id
  end
  
end
