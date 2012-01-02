class AssociationsForPromotionsAndVendorsToTaxons < ActiveRecord::Migration

  def self.up

    create_table :taxons_vendors, :id => false do |t|
      t.column :taxon_id, :integer
      t.column :vendor_id, :integer
    end

    add_index "taxons_vendors", ["vendor_id"], :name => "index_taxons_vendors_on_vendor_id"
    add_index "taxons_vendors", ["taxon_id"], :name => "index_taxons_vendors_on_taxon_id"

    create_table :promotions_taxons, :id => false do |t|
      t.column :promotion_id, :integer
      t.column :taxon_id, :integer
    end

    add_index "promotions_taxons", ["promotion_id"], :name => "index_promotions_taxons_on_promotion_id"
    add_index "promotions_taxons", ["taxon_id"], :name => "index_promotions_taxons_on_taxon_id"

  end

  def self.down
    drop_table :taxons_vendors
    drop_table :promotions_taxons
  end

end
