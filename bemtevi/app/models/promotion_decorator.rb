Promotion.class_eval do

  has_many :promotion_images, :as => :viewable, :order => :position, :dependent => :destroy
  has_one :image_template_set, :dependent => :destroy
  has_one :promotion_recurrenceday, :dependent => :destroy
  has_and_belongs_to_many :taxons
  belongs_to :vendor

  accepts_nested_attributes_for :promotion_images, :image_template_set, :promotion_recurrenceday
  
  #@weekdays = ['domingo','segunda-feira','terça-feira','quarta-feira','quinta-feira','sexta-feira','sábado']
  @@weekdays = ["domingo","segunda-feira","terça-feira","quarta-feira","quinta-feira","sexta-feira", "sábado"]
  # use deleted? rather than checking the attribute directly. this
  # allows extensions to override deleted? if they want to provide
  # their own definition.
  def weekdays
    @@weekdays
  end
  def deleted?
    !!deleted_at
  end

  def taxon_ids
    taxon_ids = []
    taxons.each { |taxon| taxon_ids << taxon.id if !taxon.deleted? }
    taxon_ids
  end

  def deactivated?
    weekdays = is_recurrence
    if weekdays != false
      weekdays = weekdays.split(',')
      today = Time.now.wday.to_s
      is_today = weekdays.include? today
      !!deactivated_at || !is_today || expires_at < Time.now
    else
      !!deactivated_at || expires_at < Time.now
    end
  end

  def active?
    !deactivated?
  end

  def activate
    update_attribute(:deactivated_at, nil)
  end

  def deactivate
    update_attribute(:deactivated_at, Time.now)
  end

  def is_recurrence
    if(promotion_recurrenceday)
      PromotionRecurrenceday.find(promotion_recurrenceday).day
    else
      false
    end
  end
  
  def showweekday
    weekdays = is_recurrence
    weekdays = weekdays.split(',')
    display_str = ""
    weekdays.each do |weekday|
      if display_str == ""
        display_str += @@weekdays[weekday.to_i]
      else
        display_str += ", "+@@weekdays[weekday.to_i]
      end
    end
    display_str
  end
end