Product.class_eval do

  def vendor
    if self.taxons.nil? || self.taxons.length == 0
      nil
    else
      taxon = self.taxons[0]
      icon_url = taxon.icon_url
      icon_url = nil if icon_url.nil? || icon_url.empty? 
      
      { :id => taxon.id,
        :name => taxon.name,
        :description => taxon.description,
        :icon_url => icon_url
      }
    end
  end

end