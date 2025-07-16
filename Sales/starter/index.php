<?php include_once('header-content.php'); ?>

<form id="dwnForm" style="position: absolute; top:12px; right:20px;" method="get" action="./download-starter-trial"></form>
<div class="top-bar">
  <div class="controls-container">
    <div class="container-fluid">
      <div class="row text-decoration-none">
        <div class="col-md-2 col-sm-2 col-lg-2 col-xl-2">
          <a href="https://staffscroll.co.uk">
            <img src="../../page/images/logo.png" style="width: 200px; height:60px; margin-bottom:10px;" alt="">
          </a>
        </div>
        <div class="col-md-2 col-sm-2 col-lg-2 col-xl-2">
          <div class="search-bar">
            <input type="text" placeholder="Search staff..." id="staff-search" />
            <span class="clear-search-btn" id="clear-search-btn" title="Clear search">&times;</span>
          </div>
        </div>
        <div class="col-md-1 col-sm-1 col-lg-1 col-xl-1 justify-left">
          <!--Filter by cities bar-->
          <div class="dropdown" id="city-dropdown-container">
            <button class="btn btn-secondary dropdown-toggle" type="button" id="cityDropdown" data-bs-toggle="dropdown" aria-expanded="false">
              Filter by City
            </button>
            <ul class="dropdown-menu p-2" aria-labelledby="cityDropdown" id="city-checkbox-list" style="max-height:200px; font-size:17px; overflow-y:auto;">
              <!-- Cities will be injected here dynamically -->
            </ul>
          </div>
        </div>
        <div class="col-md-2 col-sm-2 col-lg-2 col-xl-2">
          <div class="zoom-controls mt-2">
            &nbsp; &nbsp; &nbsp;
            <label for="zoom-range">Zoom:</label>
            <input id="zoom-range" type="range" min="30" max="120" value="60" step="1" title="Zoom timeline hours width" />
            <span style="color:#fff;" class="zoom-value" id="zoom-value"></span>
          </div>
        </div>
        <div class="col-md-2 col-sm-2 col-lg-2 col-xl-2">
          <div style="display: flex; align-items: center; gap: 5px; margin-top: 5px;">
            <button class="btn btn-sm btn-outline-secondary" id="date-prev" style="cursor:pointer; border:none; font-size:18px;">&#8592;</button>
            <input type="date" style="width: 150px;" value="<?php echo date('Y-m-d'); ?>" class="form-control" id="date-picker" />
            <button class="btn btn-sm btn-outline-secondary" id="date-next" style="cursor:pointer; border:none; font-size:18px;">&#8594;</button>
          </div>
        </div>
        <div class="col-md-3 col-sm-3 col-lg-3 col-xl-3">
          <div style="float:right;" class="btn-group pull-right justify-content-end align-items-end text-right mt-2" role="group" aria-label="Group of buttons">
            <!--<a href="https://admin.geosoftcare.co.uk/54655-476564-99iu955-4h4657/dashboard" type="button" class="btn btn-primary btn-sm text-decoration-none">Button 1</a>
            <a href="https://admin.geosoftcare.co.uk/54655-476564-99iu955-4h4657/roster/schedule-run-756473-00499-99553-85006?txtDate=<?php print date('Y-m-d'); ?>" type="button" class="btn btn-info btn-sm text-decoration-none">Button 2</a>
            <a href="https://admin.geosoftcare.co.uk/54655-476564-99iu955-4h4657/rota" type="button" class="btn btn-success btn-sm text-decoration-none">Button 3</a>-->
            <button form="dwnForm" class="btn btn-primary" type="submit">Download Trial</button>
          </div>
        </div>

      </div>
    </div>
  </div>
</div>

<div id="timeline-wrapper">
  <!-- Sticky top-left "Team" label -->
  <div id="team-label">Team</div>

  <!-- Staff labels vertical scroll only -->
  <div id="staff-labels-container">
    <div id="staff-labels"></div>
  </div>

  <!-- Timeline header horizontal scroll only -->
  <div id="timeline-header-container">
    <div id="timeline-header"></div>
  </div>

  <!-- Timeline events scroll both -->
  <div id="timeline-scroll-container">
    <div id="vertical-grid-lines"></div>
    <div id="timeline-rows"></div>
    <div id="current-time-line"></div>
  </div>
</div>

<div id="popup"></div>
<div id="tooltip"></div>


<?php include_once('footer-contents.php'); ?>