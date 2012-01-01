class AssociationsForPromotionsAndVendorsToTaxons < ActiveRecord::Migration

  def self.up

    create_table :vendors_taxons, :id => false do |t|
      t.column :vendor_id, :integer
      t.column :taxon_id, :integer
    end

    add_index "vendors_taxons", ["product_id"], :name => "index_vendors_taxons_on_product_id"
    add_index "vendors_taxons", ["taxon_id"], :name => "index_vendors_taxons_on_taxon_id"

    create_table :promotions_taxons, :id => false do |t|
      t.column :promotion_id, :integer
      t.column :taxon_id, :integer
    end

    add_index "promotions_taxons", ["product_id"], :name => "index_promotions_taxons_on_product_id"
    add_index "promotions_taxons", ["taxon_id"], :name => "index_promotions_taxons_on_taxon_id"

  end

  def self.down
    drop_table :vendors_taxons
    drop_table :promotions_taxons
  end

end
