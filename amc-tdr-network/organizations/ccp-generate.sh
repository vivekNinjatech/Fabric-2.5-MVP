#!/bin/bash

# function one_line_pem {
#     echo "`awk 'NF {sub(/\\n/, ""); printf "%s\\\\\\\n",$0;}' $1`"
# }

# function json_ccp {
#     local PP=$(one_line_pem $4)
#     local CP=$(one_line_pem $5)
#     sed -e "s/\${ORG}/$1/" \
#         -e "s/\${P0PORT}/$2/" \
#         -e "s/\${CAPORT}/$3/" \
#         -e "s#\${PEERPEM}#$PP#" \
#         -e "s#\${CAPEM}#$CP#" \
#         organizations/ccp-template.json
# }

# function yaml_ccp {
#     local PP=$(one_line_pem $4)
#     local CP=$(one_line_pem $5)
#     sed -e "s/\${ORG}/$1/" \
#         -e "s/\${P0PORT}/$2/" \
#         -e "s/\${CAPORT}/$3/" \
#         -e "s#\${PEERPEM}#$PP#" \
#         -e "s#\${CAPEM}#$CP#" \
#         organizations/ccp-template.yaml | sed -e $'s/\\\\n/\\\n          /g'
# }

# # ---------------------------------------------------------------------------
# # Define connection profiles for all peer organizations
# # ---------------------------------------------------------------------------

# # AMCOrg - Responsible for TDR issuance
# ORG=1
# P0PORT=7051
# CAPORT=7054
# PEERPEM=organizations/peerOrganizations/amcorg.example.com/tlsca/tlsca.amcorg.example.com-cert.pem
# CAPEM=organizations/peerOrganizations/amcorg.example.com/ca/ca.amcorg.example.com-cert.pem
# echo "$(json_ccp $ORG $P0PORT $CAPORT $PEERPEM $CAPEM)" > organizations/peerOrganizations/amcorg.example.com/connection-amcorg.json
# echo "$(yaml_ccp $ORG $P0PORT $CAPORT $PEERPEM $CAPEM)" > organizations/peerOrganizations/amcorg.example.com/connection-amcorg.yaml

# # MunicipalRegistrarsOrg - Handles validation and verification of TDRs
# ORG=2
# P0PORT=8051
# CAPORT=8054
# PEERPEM=organizations/peerOrganizations/municipalregistrars.example.com/tlsca/tlsca.municipalregistrars.example.com-cert.pem
# CAPEM=organizations/peerOrganizations/municipalregistrars.example.com/ca/ca.municipalregistrars.example.com-cert.pem
# echo "$(json_ccp $ORG $P0PORT $CAPORT $PEERPEM $CAPEM)" > organizations/peerOrganizations/municipalregistrars.example.com/connection-municipalregistrars.json
# echo "$(yaml_ccp $ORG $P0PORT $CAPORT $PEERPEM $CAPEM)" > organizations/peerOrganizations/municipalregistrars.example.com/connection-municipalregistrars.yaml

# # BuildersOrg - Represents TDR holders and builders in the system
# ORG=3
# P0PORT=9051
# CAPORT=9054
# PEERPEM=organizations/peerOrganizations/buildersorg.example.com/tlsca/tlsca.buildersorg.example.com-cert.pem
# CAPEM=organizations/peerOrganizations/buildersorg.example.com/ca/ca.buildersorg.example.com-cert.pem
# echo "$(json_ccp $ORG $P0PORT $CAPORT $PEERPEM $CAPEM)" > organizations/peerOrganizations/buildersorg.example.com/connection-buildersorg.json
# echo "$(yaml_ccp $ORG $P0PORT $CAPORT $PEERPEM $CAPEM)" > organizations/peerOrganizations/buildersorg.example.com/connection-buildersorg.yaml

# # CAOrg - Manages identity and certificate issuance
# ORG=4
# P0PORT=10051
# CAPORT=10054
# PEERPEM=organizations/peerOrganizations/caorg.example.com/tlsca/tlsca.caorg.example.com-cert.pem
# CAPEM=organizations/peerOrganizations/caorg.example.com/ca/ca.caorg.example.com-cert.pem
# echo "$(json_ccp $ORG $P0PORT $CAPORT $PEERPEM $CAPEM)" > organizations/peerOrganizations/caorg.example.com/connection-caorg.json
# echo "$(yaml_ccp $ORG $P0PORT $CAPORT $PEERPEM $CAPEM)" > organizations/peerOrganizations/caorg.example.com/connection-caorg.yaml

# # RegulatoryBodyOrg - Oversees compliance and audits
# ORG=5
# P0PORT=11051
# CAPORT=11054
# PEERPEM=organizations/peerOrganizations/regulatorybody.example.com/tlsca/tlsca.regulatorybody.example.com-cert.pem
# CAPEM=organizations/peerOrganizations/regulatorybody.example.com/ca/ca.regulatorybody.example.com-cert.pem
# echo "$(json_ccp $ORG $P0PORT $CAPORT $PEERPEM $CAPEM)" > organizations/peerOrganizations/regulatorybody.example.com/connection-regulatorybody.json
# echo "$(yaml_ccp $ORG $P0PORT $CAPORT $PEERPEM $CAPEM)" > organizations/peerOrganizations/regulatorybody.example.com/connection-regulatorybody.yaml

# //////////////////////////////
function one_line_pem {
    echo "`awk 'NF {sub(/\\n/, ""); printf "%s\\\\\\\n",$0;}' $1`"
}

function json_ccp {
    local PP=$(one_line_pem $4)
    local CP=$(one_line_pem $5)
    sed -e "s/\${ORG}/$1/" \
        -e "s/\${P0PORT}/$2/" \
        -e "s/\${CAPORT}/$3/" \
        -e "s#\${PEERPEM}#$PP#" \
        -e "s#\${CAPEM}#$CP#" \
        organizations/ccp-template.json
}

function yaml_ccp {
    local PP=$(one_line_pem $4)
    local CP=$(one_line_pem $5)
    sed -e "s/\${ORG}/$1/" \
        -e "s/\${P0PORT}/$2/" \
        -e "s/\${CAPORT}/$3/" \
        -e "s#\${PEERPEM}#$PP#" \
        -e "s#\${CAPEM}#$CP#" \
        organizations/ccp-template.yaml | sed -e $'s/\\\\n/\\\n          /g'
}

ORG=1
P0PORT=7051
CAPORT=7054
PEERPEM=organizations/peerOrganizations/org1.example.com/tlsca/tlsca.org1.example.com-cert.pem
CAPEM=organizations/peerOrganizations/org1.example.com/ca/ca.org1.example.com-cert.pem

echo "$(json_ccp $ORG $P0PORT $CAPORT $PEERPEM $CAPEM)" > organizations/peerOrganizations/org1.example.com/connection-org1.json
echo "$(yaml_ccp $ORG $P0PORT $CAPORT $PEERPEM $CAPEM)" > organizations/peerOrganizations/org1.example.com/connection-org1.yaml

ORG=2
P0PORT=9051
CAPORT=8054
PEERPEM=organizations/peerOrganizations/org2.example.com/tlsca/tlsca.org2.example.com-cert.pem
CAPEM=organizations/peerOrganizations/org2.example.com/ca/ca.org2.example.com-cert.pem

echo "$(json_ccp $ORG $P0PORT $CAPORT $PEERPEM $CAPEM)" > organizations/peerOrganizations/org2.example.com/connection-org2.json
echo "$(yaml_ccp $ORG $P0PORT $CAPORT $PEERPEM $CAPEM)" > organizations/peerOrganizations/org2.example.com/connection-org2.yaml
