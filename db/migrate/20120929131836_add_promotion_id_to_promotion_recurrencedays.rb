class AddPromotionIdToPromotionRecurrencedays < ActiveRecord::Migration
  def self.up
  	add_column :promotion_recurrencedays, :promotion_id, :integer
  	add_index :promotion_recurrencedays, :promotion_id
  end

  def self.down
  	remove_column :promotion_recurrencedays, :promotion_id 
  end

end
