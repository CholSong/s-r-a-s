Admin::TaxonomiesController.class_eval do

  def get_children
    @taxons = Taxon.find(params[:parent_id]).children
    @taxons.delete_if { |taxon| !taxon.deleted_at.nil? }

    respond_with(@taxons)
  end

end
