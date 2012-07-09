class Manager::PromotionsController < Manager::BaseController

  before_filter :load_vendors

  def dummy_page_5
    render "dummy_page_5", :layout => false
  end

  def templates

    template_array = Array.new(2) { |f|
      {
        :id => f,
        :templates => Array.new(2) { |t|
          template = t < 1 ? create_detail_template(f, t) : create_summary_template(f, t)
        }
      }
    }
    respond_to do |format|
      format.json { render :json => template_array }
    end
  end

  def index
    @promotions = Promotion.where(deleted_at: nil)
    @image_url = nil
  end

  def promotions
    offset = params[:pg].to_i * 12
    promotions_array = Array.new(12) { |i|
      f = i + offset
      {
        :id => f,
        :thumb => "#{path_prefix}/templates/thumbs/#{thumb_prefix_for_promos(f)}-thumb.jpg",
        :status => status_for_promo(f),
        :valdate => "10/10/2012 #{f}"
      }
    }
    response = {
      :first_page => 0,
      :last_page => 4,
      :total_pages => 5,
      :page => params[:pg],
      :templates => promotions_array
    }
    respond_to do |format|
      format.json { render :json => response }
    end
  end

  private

  def load_vendors
    @vendors = Vendor.where(deleted_at: nil)
  end

  def prefix(t)
    "f1t1"
  end

  def status_for_promo(t)
    if t < 24
      "inactive"
    elsif t < 48
      "active"
    else
      ""
    end
  end

  def thumb_prefix_for_promos(t)
    if (t < 12) 
      "f1t1"
    elsif (t < 24)
      "f1t2"
    elsif (t < 36)
      "f1t3"
    elsif (t < 48)
      "f1t1"
    else
      "f1t2"
    end
  end
  
  def thumb_prefix(t)
    "f#{t + 1}t1"
  end

  def color_array(t)
    "#6b5f9c"
  end

  def path_prefix
    "/images/bemtevi/temp"
  end

  def create_detail_template(f, t)
    {
      :id => t,
      :type => :detail,
      # :imgUrl => "",
      :bgFormat => "url(#{path_prefix}/templates/bg_template_general.jpg) left top repeat-y",
      :thumbUrl => "#{path_prefix}/templates/thumbs/#{thumb_prefix(f)}-thumb.jpg",
      :baseColor => color_array(t),
      :relatedTemplateId => "",
      :peerTemplateId => t + 1,
      :overlays => create_detail_overlays(f, t)
    }
  end

  def create_detail_overlays(f, t)
    if f == 0
      [
        {
          :id => 1,
          :type => :text,
          :tagId => :title,
          :format => { :width => "100%", :height => "103px", :background => "url(#{path_prefix}/templates/#{prefix(t)}-titulo.jpg) center top no-repeat" },
          :value => "clique aqui e de um titulo a promocao",
          :valueFormat => { :'font-size' => "22px", :'text-align' => "center", :'font-family' => "Arial", :'font-weight' => "bold", :color => "#ffeedd" }
        },
        {
          :id => 2,
          :type => :image,
          # :tagId => :title,
          :format => { :width => "100%", :height => "295px" },
          :value => "#{request.protocol}#{request.host_with_port}#{path_prefix}/temp/default01.jpg",
          :valueFormat => { :left => "0px", :top => "0px" }
        },
        {
          :id => 3,
          :type => :text,
          # :tagId => :title,
          :format => { :width => "50%", :height => "100px", :background => "url(#{path_prefix}/templates/#{prefix(t)}-rodape.jpg) center top no-repeat" },
          :value => 'clique aqui e coloque os detalhes da promocao',
          :valueFormat => { :'font-size' => "16px", :'text-align' => "left", :'font-family' => "Arial", :'font-weight' => "bold", :color => "#ffeedd" }
        },
        {
          :id => 4,
          :type => :image,
          # :tagId => :title,
          :format => { :width => "50%", :height => "100px" },
          :value => "#{request.protocol}#{request.host_with_port}#{path_prefix}/temp/default01.jpg",
          :valueFormat => { :width => "100%", :left => "0px", :top => "0px" }
        }
      ]
    else
      [
        {
          :id => 1,
          :type => :text,
          # :tagId => :title,
          :format => { :width => "50%", :height => "100px", :background => "url(#{path_prefix}/templates/#{prefix(t)}-rodape.jpg) center top no-repeat" },
          :value => 'clique aqui e coloque os detalhes da promocao',
          :valueFormat => { :'font-size' => "16px", :'text-align' => "left", :'font-family' => "Arial", :'font-weight' => "bold", :color => "#ffeedd" }
        },
        {
          :id => 2,
          :type => :image,
          # :tagId => :title,
          :format => { :width => "50%", :height => "100px" },
          :value => "#{request.protocol}#{request.host_with_port}#{path_prefix}/temp/default01.jpg",
          :valueFormat => { :width => "100%", :left => "0px", :top => "0px" }
        },
        {
          :id => 3,
          :type => :image,
          # :tagId => :title,
          :format => { :width => "100%", :height => "295px" },
          :value => "#{request.protocol}#{request.host_with_port}#{path_prefix}/temp/default01.jpg",
          :valueFormat => { :left => "0px", :top => "0px" }
        },
        {
          :id => 4,
          :type => :text,
          :tagId => :title,
          :format => { :width => "100%", :height => "103px", :background => "url(#{path_prefix}/templates/#{prefix(t)}-titulo.jpg) center top no-repeat" },
          :value => "clique aqui e de um titulo a promocao",
          :valueFormat => { :'font-size' => "22px", :'text-align' => "center", :'font-family' => "Arial", :'font-weight' => "bold", :color => "#ffeedd" }
        }
      ]
    end
  end

  def create_summary_template(f, t)
    {
      :id => t,
      :type => :simple,
      :imgUrl => "",
      :bgFormat => "url(#{path_prefix}/templates/bg_template_general.jpg) left top repeat-y",
      :thumbUrl => "#{path_prefix}/templates/thumbs/#{prefix(t)}-thumb.jpg",
      :baseColor => color_array(t),
      :relatedTemplateId => "",
      :peerTemplateId => t - 1,
      :overlays => create_summary_overlays(f, t)
    }
  end

  def create_summary_overlays(f, t)
    if f == 0
      [
        {
          :id => 1,
          :type => :text,
          :tagId => :title,
          :format => { :width => "100%", :height => "108px", :background => "url(#{path_prefix}/templates/#{prefix(t)}-titulo.jpg) center top no-repeat" },
          :value => "clique aqui e de um titulo a promocao",
          :valueFormat => { :'font-size' => "22px", :'text-align' => "center", :'font-family' => "Arial", :'font-weight' => "bold", :color => "#ffeedd" }
        },
        {
          :id => 2,
          :type => :image,
          # :tagId => :title,
          :format => { :width => "100%", :height => "118px" },
          :value => "#{request.protocol}#{request.host_with_port}#{path_prefix}/temp/default01.jpg",
          :valueFormat => { :left => "10px", :top => "10px" }
        }
      ]
    else
      [
        {
          :id => 1,
          :type => :image,
          # :tagId => :title,
          :format => { :width => "100%", :height => "118px" },
          :value => "#{request.protocol}#{request.host_with_port}#{path_prefix}/temp/default01.jpg",
          :valueFormat => { :left => "10px", :top => "10px" }
        },
        {
          :id => 2,
          :type => :text,
          :tagId => :title,
          :format => { :width => "100%", :height => "108px", :background => "url(#{path_prefix}/templates/#{prefix(t)}-titulo.jpg) center top no-repeat" },
          :value => "clique aqui e de um titulo a promocao",
          :valueFormat => { :'font-size' => "22px", :'text-align' => "center", :'font-family' => "Arial", :'font-weight' => "bold", :color => "#ffeedd" }
        }
      ]
    end
  end
end