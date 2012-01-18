class AddDeletedAtToTaxons < ActiveRecord::Migration
  
  def self.up
    add_column :taxons, :deleted_at, :datetime
  end

  def self.down
    remove_column :taxons, :deleted_at
  end
  
end
