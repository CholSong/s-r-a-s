class AddDeletedAtToPromotions < ActiveRecord::Migration
  
  def self.up
    add_column :promotions, :deleted_at, :datetime
  end

  def self.down
    remove_column :promotions, :deleted_at
  end
  
end
