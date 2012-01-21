class AddDeletedAtToTaxonomies < ActiveRecord::Migration
  
  def self.up
    add_column :taxonomies, :deleted_at, :datetime
  end

  def self.down
    remove_column :taxonomies, :deleted_at
  end
  
end
