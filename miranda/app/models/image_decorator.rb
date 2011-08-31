Image.class_eval do

  has_many :image_overlays

  def urls
    [ { :type => "original", :url => attachment.url(:original) }, 
      { :type => "small", :url => attachment.url(:small) } ]
  end

  def apply_overlays
    put "apply_overlays invoked!"
  end
  
end