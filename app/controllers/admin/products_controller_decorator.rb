Admin::ProductsController.class_eval do
  
  def location_after_save
    admin_product_images_url(@product)
  end

end
