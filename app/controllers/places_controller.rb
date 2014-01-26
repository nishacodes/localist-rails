class PlacesController < ApplicationController
  before_filter :get_list, except: [:list_all]


  def get_list
    @list = List.find(params[:list_id])
  end

  # GET /places
  # def list_all
  #   if user_signed_in?
  #     @lists = List.where(user_id: current_user.id)
  #     @places = @lists.map {|list| list.places}
  #   end
  # end

  # GET /lists/:list_id/places
  # GET /lists/:list_id/places.json
  def index
    @places = @list.places

    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: @places }
    end
  end

  # GET /lists/:list_id/places/1
  # GET /lists/:list_id/places/1.json
  def show
    @place = Place.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.json { render json: [@list,@place] }
    end
  end

  # GET /lists/:list_id/places/new
  # GET /lists/:list_id/places/new.json
  def new
    @place = @list.places.build
    
    respond_to do |format|
      format.html # new.html.erb
      format.json { render json: @place }
    end
  end

  # GET /lists/:list_id/places/1/edit
  def edit
    @place = Place.find(params[:id])
  end

  # POST /lists/:list_id/places
  # POST /lists/:list_id/places.json
  def create
    @place = @list.places.new(params[:place])
    @list.save

    respond_to do |format|
      if @place.save
        
        format.html { redirect_to :action => :show, :id => @place.id, notice: 'Place was successfully created.' }
        format.json { render json: [@list,@place], status: :created, location: [@list,@place] }
      else
        format.html { render action: "new" }
        format.json { render json: @place.errors, status: :unprocessable_entity }
      end
    end
  end

  # PUT /lists/:list_id/places/1
  # PUT /lists/:list_id/places/1.json
  def update
    @place = Place.find(params[:id])

    respond_to do |format|
      if @place.update_attributes(params[:place])
        format.html { redirect_to :action => :show, :id => @place.id, notice: 'Place was successfully updated.' }
        format.json { head :no_content }
      else
        format.html { render action: "edit" }
        format.json { render json: @place.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /lists/:list_id/places/1
  # DELETE /lists/:list_id/places/1.json
  def destroy
    @place = Place.find(params[:id])
    @place.destroy

    respond_to do |format|
      format.html { redirect_to list_places_url }
      format.json { head :no_content }
    end
  end
end
