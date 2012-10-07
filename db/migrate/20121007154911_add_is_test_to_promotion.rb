class AddIsTestToPromotion < ActiveRecord::Migration
  def self.up
  	add_column :promotions, :is_test, :boolean
  end

  def self.down
  	remove_column :promotions, :is_test
  end
end
