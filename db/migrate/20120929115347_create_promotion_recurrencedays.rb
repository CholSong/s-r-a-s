class CreatePromotionRecurrencedays < ActiveRecord::Migration
  def self.up
    create_table :promotion_recurrencedays do |t|
      t.string :day

      t.timestamps
    end
  end

  def self.down
    drop_table :promotion_recurrencedays
  end
end
