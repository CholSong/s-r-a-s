class ImageOverlay < ActiveRecord::Base

  # Bemtevi TODO
  # Removing this temporarily as it works only in Spree 0.70.x
  # include SubclassRegistration
  
  # Bemtevi TODO
  # This could be a polimorphic relation to Template and Image, if we want to store the overlays with the
  # product image generated from a template.
  belongs_to :image_template
  
end
