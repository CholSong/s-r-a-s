class ImageOverlay < ActiveRecord::Base
  include SubclassRegistration
  
  belongs_to :image
  
end
