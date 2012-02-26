class TextOverlay < ActiveRecord::Base

  # Bemtevi TODO
  # Removing this temporarily as it works only in Spree 0.70.x
  # include SubclassRegistration
  
  belongs_to :overlay

end
