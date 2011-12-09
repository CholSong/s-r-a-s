class CreateVendors < ActiveRecord::Migration
  def self.up
    create_table(:vendors) do |t|
      t.column :vendor_id, :integer
      t.column :name, :string
      t.column :description, :text
      t.column :address_id, :integer
      
      t.timestamps
    end
  end

  def self.down
    drop_table :vendors
  end
end
