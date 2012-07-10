class AddDeactivatedAtToPromotions < ActiveRecord::Migration
  def self.up
  	add_column :promotions, :deactivated_at, :datetime
  end

  def self.down
  	remove_column :promotions, :deactivated_at
  end
end
