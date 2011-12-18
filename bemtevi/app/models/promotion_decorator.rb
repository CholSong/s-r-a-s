Promotion.class_eval do

  has_many :images, :as => :viewable, :order => :position, :dependent => :destroy
  
end