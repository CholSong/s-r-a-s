class Vendor < ActiveRecord::Base

  belongs_to :address
  has_many :images, :as => :viewable, :order => :position, :dependent => :destroy

end