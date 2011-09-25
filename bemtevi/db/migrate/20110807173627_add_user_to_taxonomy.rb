class AddUserToTaxonomy < ActiveRecord::Migration
  def self.up
    add_column :taxonomies, :user_id, :integer
  end

  def self.down
    remove_column :taxonomies, :user_id
  end
end