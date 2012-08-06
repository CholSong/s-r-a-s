class AddUserToVendor < ActiveRecord::Migration
  
  def self.up
    add_column :vendors, :user_id, :integer
  end

  def self.down
    remove_column :vendors, :user_id
  end
  
end
