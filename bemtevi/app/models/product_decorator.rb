Product.class_eval do
  
  belongs_to :vendor

  def taxon_ids
    taxon_ids = []
    taxons.each { |taxon| taxon_ids << taxon.id if !taxon.deleted? }
    taxon_ids
  end

end