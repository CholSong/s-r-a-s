class RefactoringImageTemplateModel < ActiveRecord::Migration
  
  def self.up
    change_table :image_overlays do |t|
      t.remove :type
      t.remove :text
      t.remove :attachment_content_type
      t.remove :attachment_file_name
      t.remove :attachment_size
      t.remove :attachment_updated_at
      t.remove :attachment_width
      t.remove :attachment_height
      t.remove :font_family
      t.remove :image_template_id
      t.integer :width
      t.integer :height
      t.integer :overlay_id
    end
    
    create_table :text_overlays do |t|
      t.string :font_family
      t.string :font_size
      t.string :font_weight
      t.string :font_style
      t.string :text_align
      t.string :text_decoration
      t.string :color
      t.string :text
      t.integer :overlay_id
    end
  
    create_table :overlays do |t|
      t.integer :position_x
      t.integer :position_y
      t.integer :width
      t.integer :height
      t.string :tag
      t.integer :image_template_id
    end
    
    create_table :image_templates do |t|
      t.string :template_type
      t.integer :image_template_set_id
    end
    
    create_table :image_template_sets do |t|
      t.string :name
      t.integer :vendor_id
      t.integer :promotion_id
      t.integer :original_template_set_id
    end
  end

  def self.down
    change_table :image_overlays do |t|
      t.string :type
      t.string :text
      t.string :attachment_content_type
      t.string :attachment_file_name
      t.integer :attachment_size
      t.datetime :attachment_updated_at
      t.integer :attachment_width
      t.integer :attachment_height
      t.string :font_family
      t.integer :image_template_id
      t.remove :width
      t.remove :height
      t.remove :overlay_id
    end
    
    drop_table :text_overlays
    drop_table :overlays
    drop_table :image_templates
    drop_table :image_template_sets
  end
  
end
